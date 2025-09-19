# SvelteKit Forma

A modern form library for SvelteKit built on top of the new **remote functions** feature. Forma provides accessible, type-safe, and progressive enhancement-ready form components that integrate seamlessly with SvelteKit's server-side functionality.

## Features

- 🚀 **Built for SvelteKit 2.27+** - Uses the new experimental remote functions
- 🎯 **Type-safe** - Full TypeScript support with excellent type inference
- ♿ **Accessible** - ARIA attributes and proper semantic HTML out of the box
- 🎨 **Flexible** - Bring your own styles, works with any CSS framework
- 🔄 **Progressive Enhancement** - Works without JavaScript, enhanced with it
- 📱 **Reactive** - Real-time validation and form state updates
- 🧩 **Composable** - Component-based architecture with sensible defaults

## Quick Start

![SvelteKit Forma Demo](https://github.com/user-attachments/assets/b679444b-21a6-4af8-ac64-b2a77b5c4a6f)

### Installation

```bash
npm install sveltekit-forma
```

### Enable Remote Functions

Add the experimental remote functions feature to your `svelte.config.js`:

```js
/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    experimental: {
      async: true
    }
  },
  kit: {
    experimental: {
      remoteFunctions: true
    }
  }
};

export default config;
```

### Basic Usage

```svelte
<script lang="ts">
  import { Field, Control, Label, FieldErrors, Description } from 'sveltekit-forma';
  import type { FormaForm } from 'sveltekit-forma';

  // Create reactive form state
  let formValues = $state({
    email: '',
    name: '',
    bio: ''
  });

  let formErrors = $state<Record<string, string[]>>({});

  // Create form object with validation
  const form: FormaForm = {
    get errors() { return formErrors; },
    get values() { return formValues; },
    get touched() { return formTouched; },

    async validate() {
      const errors: Record<string, string> = {};
      
      if (!formValues.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      if (!formValues.name) {
        errors.name = 'Name is required';
      }
      
      // Update form errors
      const newErrors: Record<string, string[]> = {};
      Object.keys(errors).forEach(key => {
        newErrors[key] = [errors[key]];
      });
      formErrors = newErrors;
      
      return Object.keys(formErrors).length === 0;
    },

    setValue(name: string, value: any) {
      formValues = { ...formValues, [name]: value };
    },

    // ... other methods
  };
</script>

<form>
  <Field {form} name="email">
    <Label>Email Address</Label>
    <Control>
      {#snippet children({ props })}
        <input 
          type="email" 
          {...props} 
          bind:value={formValues.email}
        />
      {/snippet}
    </Control>
    <Description>We'll send you important updates via email.</Description>
    <FieldErrors />
  </Field>

  <Field {form} name="name">
    <Label>Full Name</Label>
    <Control>
      {#snippet children({ props })}
        <input 
          type="text" 
          {...props} 
          bind:value={formValues.name}
        />
      {/snippet}
    </Control>
    <FieldErrors />
  </Field>

  <button type="submit">Submit</button>
</form>
```

## Components

### Field
The root component that provides context for all other form components.

```svelte
<Field {form} name="fieldName">
  <!-- Other form components go here -->
</Field>
```

### Control
Wraps form controls and provides proper attributes for accessibility.

```svelte
<Control>
  {#snippet children({ props })}
    <input type="text" {...props} bind:value={formValues.fieldName} />
  {/snippet}
</Control>
```

### Label
Accessible label component that automatically associates with the control.

```svelte
<Label>Field Label</Label>
```

### FieldErrors
Displays validation errors for the current field.

```svelte
<FieldErrors />
```

### Description
Provides additional context for the field.

```svelte
<Description>Help text for this field</Description>
```

### Fieldset & Legend
For grouping related form controls (like radio buttons).

```svelte
<Fieldset {form} name="theme">
  <Legend>Select your theme</Legend>
  <!-- Radio buttons or other grouped controls -->
</Fieldset>
```

## Integration with Remote Functions

SvelteKit Forma is designed to work seamlessly with SvelteKit's remote functions:

```typescript
// users.remote.ts
import { form } from '$app/server';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  bio: z.string().optional()
});

export const createUser = form(async (data: FormData) => {
  const rawData = {
    email: data.get('email'),
    name: data.get('name'),
    bio: data.get('bio')
  };

  try {
    const validData = userSchema.parse(rawData);
    // Save to database
    return { success: true };
  } catch (error) {
    // Return validation errors
    return { errors: /* formatted errors */ };
  }
});
```

```svelte
<!-- +page.svelte -->
<script>
  import { createUser } from './users.remote.js';

  const remoteForm = createUser;
</script>

<form 
  {...remoteForm.enhance(async ({ submit }) => {
    const isValid = await form.validate();
    if (isValid) {
      await submit();
      form.reset();
    }
  })}
>
  <!-- Form components -->
</form>
```

## Examples

Check out the `/simple` route in this repository for a complete working example.

## Requirements

- SvelteKit 2.27.0 or later
- Svelte 5.0.0 or later
- TypeScript (recommended)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.