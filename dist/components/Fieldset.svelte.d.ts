import { type FormaForm } from '../form.js';
import type { Snippet } from 'svelte';
interface Props {
    form: FormaForm;
    name: string;
    children: Snippet;
}
declare const Fieldset: import("svelte").Component<Props, {}, "">;
type Fieldset = ReturnType<typeof Fieldset>;
export default Fieldset;
