import { MediaStatusEnum } from "@config/enums/MediaStatusEnum";
import { TranscodingStatusEnum } from "@config/enums/TranscodingStatus.enum";

export interface MediaMetadata {
  id: number;
  mediaId: number
  watchTime: number;
  transcodingStatus: TranscodingStatusEnum
  lastSeenAt: string;
  status: MediaStatusEnum
}

export interface MediaMetadataApi {
  id: number;
  media_id: number;
  watch_time: number;
  transcoding_status: TranscodingStatusEnum;
  last_seen_at: string;
  status: MediaStatusEnum;
}