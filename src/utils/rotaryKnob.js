export class RotaryKnob {
  constructor(element, options = {}) {
    this.element = element;
    this.knob = element.querySelector('.knob');
    this.onChange = options.onChange || (() => {});

    // Configuration
    this.min = options.min !== undefined ? options.min : 0;
    this.max = options.max !== undefined ? options.max : 100;
    this.defaultValue = options.defaultValue !== undefined ? options.defaultValue : (this.min + this.max) / 2;
    this.minAngle = -135;
    this.maxAngle = 135;

    // State
    this.value = this.defaultValue;
    this.isDragging = false;

    // Create and append the value display
    this.valueDisplay = document.createElement('span');
    this.valueDisplay.className = 'knob-value';
    this.knob.appendChild(this.valueDisplay);

    // Bind events for both mouse and touch
    this.element.addEventListener('mousedown', this.startDrag.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.endDrag.bind(this));

    this.element.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });
    document.addEventListener('touchmove', this.drag.bind(this), { passive: false });
    document.addEventListener('touchend', this.endDrag.bind(this));

    // Set initial state
    this.setValue(this.defaultValue);
  }

  startDrag(event) {
    event.preventDefault();
    this.isDragging = true;
    this.element.classList.add('knob--active');
    this.drag(event); // Immediately update to the initial click/touch position
  }

  drag(event) {
    if (!this.isDragging) return;
    event.preventDefault();

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
    let angleDeg = angleRad * 180 / Math.PI;

    // Normalize angle to be within our min/max range
    angleDeg = Math.max(this.minAngle, Math.min(this.maxAngle, angleDeg));
    
    const percentage = (angleDeg - this.minAngle) / (this.maxAngle - this.minAngle);
    const newValue = this.min + percentage * (this.max - this.min);
    
    this.setValue(newValue);
  }

  endDrag() {
    this.isDragging = false;
    this.element.classList.remove('knob--active');
  }

  setValue(value) {
    // Clamp value to min/max
    this.value = Math.max(this.min, Math.min(this.max, value));

    // Update UI
    this.valueDisplay.textContent = Math.round(this.value);
    const percentage = (this.value - this.min) / (this.max - this.min);
    const angle = this.minAngle + percentage * (this.maxAngle - this.minAngle);
    this.knob.style.transform = `rotate(${angle}deg)`;

    // Notify listener with a normalized 0-100 value for the audio engine
    if (this.onChange) {
      this.onChange(percentage * 100);
    }
  }

  getNormalizedValue() {
    return (this.value - this.min) / (this.max - this.min) * 100;
  }
}