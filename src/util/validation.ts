  // Validation Logic
  export interface Val {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }

  export function Validate(objV: Val) {
    let isValid = true;

    if (objV.required) {
      isValid = isValid && objV.value.toString().trim().length !== 0;
    }
    if (objV.minLength != null && typeof objV.value === "string") {
      isValid = isValid && objV.value.length >= objV.minLength;
    }
    // maxLength
    if (objV.required) {
      isValid = isValid && objV.value.toString().trim().length !== 0;
    }
    if (objV.maxLength != null && typeof objV.value === "string") {
      isValid = isValid && objV.value.length <= objV.maxLength;
    }
    // validation for number
    if (objV.required && objV.min != null && typeof objV.value === "number") {
      isValid = isValid && objV.value >= objV.min;
    }
    if (objV.required && objV.max != null && typeof objV.value === "number") {
      isValid = isValid && objV.value <= objV.max;
    }
    return isValid;
  }

