import * as React from 'react';
import { JsonEditor } from 'jsoneditor-react';
import ace from 'brace';

import 'jsoneditor-react/es/editor.min.css';
import 'brace/mode/json';
import 'brace/theme/github';

interface EditorProps {
    json: string;
    onChange: (string) => void;
    schema: any
}

export class Editor extends React.Component<EditorProps> {
    render() {
        const { json, onChange, schema } = this.props;

        return (
            <section className="editor">
                <JsonEditor
                    value={json}
                    onChange={onChange}
                    ace={ace}
                    theme="ace/theme/github"
                    schema={schema}
                />
            </section>
        );
    }
}

