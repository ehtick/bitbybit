import { ResourcesService } from '../../../../../resources';

export function ioCategory() {
    const resources = ResourcesService.getResources();
    return `
    <category name="${resources.block_toolbox_category_io}"  categorystyle="geometry_category">
        <category name="${resources.block_toolbox_category_io_text}"  categorystyle="geometry_category">
            <block type="base_io_import_text_file">
            </block>
            <block type="base_io_print_save">
                <value name="Text">
                    <block type="text">
                        <field name="TEXT">abc</field>
                    </block>
                </value>
            </block>
            <block type="base_io_save">
                <value name="Text">
                    <block type="text">
                        <field name="TEXT">abc</field>
                    </block>
                </value>
            </block>
        </category>
        <category name="${resources.block_toolbox_category_io_http}"  categorystyle="geometry_category">
            <block type="base_io_http_get">
            </block>
            <block type="base_io_http_post">
            </block>
            <block type="base_io_http_put">
            </block>
            <block type="base_io_http_patch">
            </block>
            <block type="base_io_http_delete">
            </block>
            <block type="base_io_http_options">
            </block>
            <block type="base_io_http_header">
            </block>
            <block type="base_io_http_param">
            </block>
        </category>
        <category name="${resources.block_toolbox_category_io_json}"  categorystyle="geometry_category">
            <block type="base_io_json_path_query">
            </block>
            <block type="base_io_json_set_path_value">
            </block>
            <block type="base_io_json_set_paths_values">
            </block>
            <block type="base_io_json_path_value">
            </block>
            <block type="base_io_json_empty_object">
            </block>
            <block type="base_io_json_preview">
            </block>
        </category>
    </category>
`;
}