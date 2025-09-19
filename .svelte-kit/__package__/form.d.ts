export interface FormaForm {
    errors: Record<string, string[]>;
    values: Record<string, any>;
    touched: Record<string, boolean>;
    validate: (name?: string) => Promise<boolean>;
    setError: (name: string, error: string | string[]) => void;
    clearError: (name: string) => void;
    setValue: (name: string, value: any) => void;
    getValue: (name: string) => any;
    reset: () => void;
    submit: () => Promise<void>;
}
export interface FormaFieldContext {
    name: string;
    form: FormaForm;
    fieldId: string;
    labelId: string;
    descriptionId: string;
    errorId: string;
    hasErrors: boolean;
    errors: string[];
    value: any;
}
/**
 * Sets the form context for child components
 */
export declare function setFormContext(form: FormaForm): void;
/**
 * Gets the form context
 */
export declare function getFormContext(): FormaForm;
/**
 * Sets the field context for child components
 */
export declare function setFieldContext(context: FormaFieldContext): void;
/**
 * Gets the field context
 */
export declare function getFieldContext(): FormaFieldContext;
/**
 * Generates a unique ID for form elements
 */
export declare function generateId(prefix?: string): string;
