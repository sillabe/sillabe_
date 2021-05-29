import { PluginScope } from './PluginScope';
import { AttachmentEnhancement } from './AttachmentEnhancement';
import { Attachment } from '../../node/Attachment';
import { IPlugin } from '../IPlugin';

export interface IAttachmentEnhancerPlugin extends IPlugin {
    enhance(attachment: Attachment, currentEnhancement: AttachmentEnhancement): AttachmentEnhancement;
}

export const isAttachmentEnhancerPlugin = (object: IPlugin): object is IAttachmentEnhancerPlugin => {
    return object.hasScope(PluginScope.AttachmentEnhancerPlugin) && 'enhance' in object;
};
