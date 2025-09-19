# Formote

The most powerful form library for SvelteKit with native remote functions support.

[![npm version](https://badge.fury.io/js/formote.svg)](https://badge.fury.io/js/formote)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**Formote** is a modern, accessible, and type-safe form library built specifically for SvelteKit's experimental remote functions feature. It provides a component-based architecture with excellent developer experience, inspired by formsnap but designed from the ground up for remote functions.

## ✨ Features

- 🚀 **Native Remote Functions Support** - Built for SvelteKit 2.42+ remote functions
- 🎯 **Type-Safe** - Full TypeScript support with excellent type inference
- ♿ **Accessible by Default** - ARIA attributes and semantic HTML out of the box
- 🎨 **Unstyled & Flexible** - Bring your own styles, works with any CSS framework
- 🔄 **Progressive Enhancement** - Works without JavaScript, enhanced with it
- 📱 **Reactive** - Real-time validation and form state updates using Svelte 5 runes
- 🧩 **Composable** - Component-based architecture with sensible defaults
- 🌙 **shadcn/ui Compatible** - Works seamlessly with shadcn-svelte components

## 📦 Installation

```bash
npm install formote
```

> **⚠️ Compatibility Notice**: Formote requires SvelteKit 2.42+ as the remote functions API was stabilized in this version. It is not compatible with SvelteKit 2.27 to 2.41 due to API changes in the remote functions implementation.

## 🚀 Quick Start

### 1. Enable Remote Functions

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

### 2. Create a Remote Function

```typescript
// src/routes/users.remote.ts
import { form } from '$app/server';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(1, 'Name is required'),
  bio: z.string().optional()
});

export const createUser = form(userSchema, async (data) => {
  // Save to database
  return { success: true, user: data };
});
```

### 3. Create Your Form

```svelte
<script lang="ts">
  import { Field, Control, Label, FieldErrors, Description } from 'formote';
  import { createUser } from './users.remote.js';
  import { z } from 'zod';

  // Client-side validation schema
  const clientSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    bio: z.string().optional()
  });

  // Create form with preflight validation
  const form = {
    remoteForm: createUser.preflight(clientSchema),
    name: 'createUser'
  };
</script>

<form {...form.remoteForm}>
  <Field {form} name="email">
    <Label>Email Address</Label>
    <Control>
      {#snippet children({ props })}
        <input type="email" {...props} class="input" />
      {/snippet}
    </Control>
    <Description>We'll send you important updates via email.</Description>
    <FieldErrors />
  </Field>

  <Field {form} name="name">
    <Label>Full Name</Label>
    <Control>
      {#snippet children({ props })}
        <input type="text" {...props} class="input" />
      {/snippet}
    </Control>
    <FieldErrors />
  </Field>

  <button type="submit">Create User</button>
</form>
```

## 🧩 Components

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
    <input type="text" {...props} />
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

## 🎨 Usage with shadcn-svelte

Formote works perfectly with shadcn-svelte components:

```svelte
<script lang="ts">
  import { Field, Control, Label, FieldErrors } from 'formote';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import { createUser } from './users.remote.js';

  const form = {
    remoteForm: createUser.preflight(clientSchema),
    name: 'createUser'
  };
</script>

<form {...form.remoteForm} class="space-y-4">
  <Field {form} name="email">
    <Label class="text-sm font-medium">Email Address</Label>
    <Control>
      {#snippet children({ props })}
        <Input type="email" {...props} />
      {/snippet}
    </Control>
    <FieldErrors class="text-sm text-destructive" />
  </Field>

  <Button type="submit">Create User</Button>
</form>
```

## 📖 API Reference

### FormoteForm Interface

```typescript
interface FormoteForm {
  remoteForm: RemoteForm;
  name: string;
}

interface RemoteForm {
  issues?: Record<string, Array<{ message: string }>> | null;
  input?: Record<string, any>;
  field?: (name: string) => string;
  validate?: (options?: { includeUntouched?: boolean }) => void;
  result?: any;
  [key: string]: any; // For method, action, and other form props
}
```

## 🔧 Advanced Usage

### Custom Validation

```svelte
<script>
  // Validate on every keystroke
  const form = {
    remoteForm: createUser.preflight(clientSchema),
    name: 'createUser'
  };
</script>

<form {...form.remoteForm} oninput={() => form.remoteForm.validate?.()}>
  <!-- form fields -->
</form>
```

### Enhanced Form Submission

```svelte
<script>
  import { enhance } from '$app/forms';

  const form = {
    remoteForm: createUser.enhance(async ({ submit }) => {
      const result = await submit();
      if (result.success) {
        // Handle success
      }
    }),
    name: 'createUser'
  };
</script>
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

## 📝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [mudiageo](https://github.com/mudiageo)

## 🔗 Links

- [Documentation](https://formote.dev)
- [Examples](https://github.com/mudiageo/sveltekit-forma/tree/main/examples)
- [Changelog](CHANGELOG.md)
- [SvelteKit Remote Functions](https://svelte.dev/docs/kit/remote-functions)