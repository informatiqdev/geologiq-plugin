import { Surface } from '../models/surface';

const ids = [
    '03aa12e4-5d73-4b79-baa8-0fee806327bf',
    '0af82424-8e22-4e08-a898-34158a7ced89',
    '32bb32a4-4990-4c2b-8fc5-bd260025406f',
    '38f9f06b-dbd7-4c9a-abf6-dc074cfffc15',
    // '3efe63b0-c906-4d34-9a10-b31e17a5d264',
    // '52b1adf6-34a4-4047-9252-6a9b253b65fe',
    // '603997e9-4ea1-4a8c-8179-d28f8e048b29',
    // '6b4271d9-4a00-43ca-8913-28d753508753',
    // '6da34026-722d-4a36-8ea7-806a02d7aa70',
    // '7a74aff0-4576-49d8-b1b9-8e41df3e62c6',
    // '94f9446c-ae4c-4896-b9a2-2e67692c872d',
    // 'a36aa11f-ef0f-4ae8-a5c9-a3dcf6518c99',
    // 'd78fc0b3-f48e-4739-8625-39f5db476bf6',
    // 'ea7eb465-a48c-4fc8-8df4-5116ffcfea47'
];

export const SurfaceSample: Surface[] = ids.map(id => {
    return {
        id,
        // url: id
        url: `https://informatiqdev.blob.core.windows.net/unity/surfaces/${id}/surface.json`
    }
});
