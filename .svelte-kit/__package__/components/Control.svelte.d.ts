import type { Snippet } from 'svelte';
interface Props {
    children: Snippet<[{
        props: Record<string, any>;
    }]>;
}
declare const Control: import("svelte").Component<Props, {}, "">;
type Control = ReturnType<typeof Control>;
export default Control;
