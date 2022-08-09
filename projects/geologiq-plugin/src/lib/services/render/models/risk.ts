import { ModelRef } from './model-ref';

export class Risk {
    id: string = '';
    title?: string;
    depth?: number;
    parent?: ModelRef;
}
