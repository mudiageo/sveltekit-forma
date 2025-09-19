import { type FormaForm } from '../form.js';
import type { Snippet } from 'svelte';
interface Props {
    form: FormaForm;
    name: string;
    children: Snippet;
}
declare const Field: import("svelte").Component<Props, {}, "">;
type Field = ReturnType<typeof Field>;
export default Field;
