import { ALIGN_RIGHT, Block, Blocks } from 'blockly';
import * as JavaScript from 'blockly/javascript';
import { ResourcesInterface, ResourcesService } from '../../../resources';
import { createStandardContextIIFE } from '../../_shared';
import { getRequired, makeRequiredValidationModelForInputs, BitByBitBlockHandlerService, ValidationEntityInterface } from '../../validations';

export function createJsonPathValueBlock() {

    const resources = ResourcesService.getResources();
    const blockSelector = 'base_io_json_path_value';
    Blocks[blockSelector] = {
        init() {
            this.appendValueInput('Value')
                .setAlign(ALIGN_RIGHT)
                .appendField(resources.block_base_io_json_path_value_input_value);
            this.appendValueInput('Path')
                .setCheck('String')
                .setAlign(ALIGN_RIGHT)
                .appendField(resources.block_base_io_json_path_value_input_path.toLowerCase());
            this.setOutput(true, 'Any');
            this.setColour('#fff');
            this.setHelpUrl('https://www.npmjs.com/package/jsonpath');
            this.setTooltip(resources.block_base_io_json_path_value_description);
        }
    };

    JavaScript[blockSelector] = (block: Block) => {
        const inputs = {
            value: JavaScript.valueToCode(block, 'Value', JavaScript.ORDER_ATOMIC),
            path: JavaScript.valueToCode(block, 'Path', JavaScript.ORDER_ATOMIC),
        };
        // this is first set of validations to check that all inputs are non empty strings
        BitByBitBlockHandlerService.validate(block, block.workspace, makeRequiredValidationModelForInputs(resources, inputs, [
            resources.block_value, resources.block_path
        ]));

        // this creates validation model to be used at runtime to evaluate real values of inputs
        const runtimeValidationModel = makeRuntimeValidationModel(resources, Object.keys(inputs));
        (block as any).validationModel = runtimeValidationModel;
        const code = createStandardContextIIFE(block, blockSelector, inputs, true,
            `
            return {path: inputs.path, value: inputs.value};
            `);
        return [code, JavaScript.ORDER_ATOMIC];
    };
}

function makeRuntimeValidationModel(
    resources: ResourcesInterface,
    keys: string[]
): ValidationEntityInterface[] {

    return [{
        entity: keys[0],
        validations: [
            getRequired(resources, resources.block_value),
        ]
    }, {
        entity: keys[1],
        validations: [
            getRequired(resources, resources.block_path),
        ]
    }];
}