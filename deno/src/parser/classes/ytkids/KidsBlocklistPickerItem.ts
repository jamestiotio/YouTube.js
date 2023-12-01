import Text from '../misc/Text.ts';
import { YTNode } from '../../helpers.ts';
import { Parser, type RawNode } from '../../index.ts';
import ToggleButton from '../ToggleButton.ts';
import Thumbnail from '../misc/Thumbnail.ts';
import type Actions from '../../../core/Actions.ts';
import { InnertubeError } from '../../../utils/Utils.ts';
import { type ApiResponse } from '../../../core/Actions.ts';

export default class KidsBlocklistPickerItem extends YTNode {
  static type = 'KidsBlocklistPickerItem';

  #actions?: Actions;

  child_display_name: Text;
  child_account_description: Text;
  avatar: Thumbnail[];
  block_button: ToggleButton | null;
  blocked_entity_key: string;

  constructor(data: RawNode) {
    super();
    this.child_display_name = new Text(data.childDisplayName);
    this.child_account_description = new Text(data.childAccountDescription);
    this.avatar = Thumbnail.fromResponse(data.avatar);
    this.block_button = Parser.parseItem(data.blockButton, [ ToggleButton ]);
    this.blocked_entity_key = data.blockedEntityKey;
  }

  async blockChannel(): Promise<ApiResponse> {
    if (!this.#actions)
      throw new InnertubeError('An active caller must be provide to perform this operation.');

    const button = this.block_button;

    if (!button)
      throw new InnertubeError('Block button was not found.', { child_display_name: this.child_display_name });

    if (button.is_toggled)
      throw new InnertubeError('This channel is already blocked.', { child_display_name: this.child_display_name });

    const response = await button.endpoint.call(this.#actions, { parse: false });
    return response;
  }

  setActions(actions: Actions | undefined) {
    this.#actions = actions;
  }
}