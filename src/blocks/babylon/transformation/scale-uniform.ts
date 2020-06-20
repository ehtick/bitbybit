import { ALIGN_RIGHT, Block, Blocks } from 'blockly';
import * as JavaScript from 'blockly/javascript';
import { ResourcesService } from '../../../resources';
import { createStandardContextIIFE } from '../../_shared';
import { makeRequiredValidationModelForInputs, BitByBitBlockHandlerService, ValidationEntityInterface } from '../../validations';

export function createScaleUniformBlock() {

    const resources = ResourcesService.getResources();
    const blockSelector = 'babylon_transformation_scale_uniform';

    Blocks[blockSelector] = {
        init() {
            this.appendValueInput('Scale')
                .setCheck('Number')
                .setAlign(ALIGN_RIGHT)
                .appendField(resources.block_babylon_input_transformation_scale_uniform);
            this.setOutput(true, 'Matrix');
            this.setColour('#fff');
            this.setTooltip(resources.block_babylon_transformation_scale_uniform_description);
            this.setHelpUrl('');
        }
    };

    JavaScript[blockSelector] = (block: Block) => {
        const inputs = {
            scale: JavaScript.valueToCode(block, 'Scale', JavaScript.ORDER_ATOMIC),
        };

        // this is first set of validations to check that all inputs are non empty strings
        BitByBitBlockHandlerService.validate(block, block.workspace, makeRequiredValidationModelForInputs(resources, inputs, [
            resources.block_scale
        ]));

        const code = createStandardContextIIFE(block, blockSelector, inputs, true,
`
        return new BABYLON.Matrix.Scaling(inputs.scale, inputs.scale, inputs.scale);
`);
        return [code, JavaScript.ORDER_ATOMIC];
    };
}