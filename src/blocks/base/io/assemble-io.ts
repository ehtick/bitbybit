import { createHttpDeleteBlock } from './http-delete';
import { createHttpGetBlock } from './http-get';
import { createHttpHeaderBlock } from './http-header';
import { createHttpOptionsBlock } from './http-options';
import { createHttpParamBlock } from './http-param';
import { createHttpPatchBlock } from './http-patch';
import { createHttpPostBlock } from './http-post';
import { createHttpPutBlock } from './http-put';
import { createImportTextFileBlock } from './import-text-file';
import { createJsonEmptyObjectBlock } from './json-empty-object';
import { createJsonPathQueryBlock } from './json-path-query';
import { createJsonPathValueBlock } from './json-path-value';
import { createJsonPreviewBlock } from './json-preview';
import { createJsonSetPathValueBlock } from './json-set-path-value';
import { createJsonSetPathsValuesBlock } from './json-set-paths-values';
import { createPrintSaveBlock } from './print-save';
import { createSaveBlock } from './save';

export function assembleIOBlocks() {
    createPrintSaveBlock();
    createSaveBlock();
    createImportTextFileBlock();
    createHttpGetBlock();
    createHttpPutBlock();
    createHttpPostBlock();
    createHttpDeleteBlock();
    createHttpPatchBlock();
    createHttpOptionsBlock();
    createHttpHeaderBlock();
    createHttpParamBlock();
    createJsonPathQueryBlock();
    createJsonSetPathValueBlock();
    createJsonEmptyObjectBlock();
    createJsonPreviewBlock();
    createJsonSetPathsValuesBlock();
    createJsonPathValueBlock();
}