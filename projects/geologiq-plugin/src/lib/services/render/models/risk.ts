import { ModelRef } from './model-ref';

export class Risk {
    id = '';
    title?: string;
    depth?: number;
    parent?: ModelRef;
}
