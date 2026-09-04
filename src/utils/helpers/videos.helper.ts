// @ts-nocheck
import { UploadItemStatus } from "@config/enums/uploadItemStatus.enum"
import { UploadItem } from "@redux/apis/video/videoApi.type"

export const mapBackendStatus = (status: string): UploadItem['status'] => {
  switch (status) {
    case 'PENDING':
    case 'MERGING_STARTED':
    case 'MERGING':
    case 'VERIFYING_CHUNKS':
    case 'PREPARING_MERGE':
    case 'MERGING_CHUNKS':
    case 'VERIFYING_MERGE':
    case 'UPDATING_DATABASE':
    case 'DATABASE_UPDATED':
    case 'MERGE_COMPLETED':
    case 'MERGED':
    case 'QUEUED_FOR_TRANSCODING':
    case 'QUEUING_TRANSCODING':
      return UploadItemStatus.MERGING
    case 'TRANSCODING_STARTED':
    case 'ANALYZING_VIDEO':
    case 'PREPARING_OUTPUT':
    case 'TRANSCODING':
    case 'PROCESSING':
    case 'COPYING_FILE':
    case 'UPLOADING_TO_S3':
    case 'FINALIZING':
      return UploadItemStatus.TRANSCODING
    case 'COMPLETED':
    case 'TRANSCODED':
      return UploadItemStatus.COMPLETED
    case 'FAILED':
    case 'MERGE_FAILED':
    case 'TRANSCODE_FAILED':
      return UploadItemStatus.FAILED
    case 'CANCELLED':
      return UploadItemStatus.CANCELLED
      case 'DELETED':
      return UploadItemStatus.DELETED;
    default:
      return UploadItemStatus.FAILED
  }
}


export const useGetStatusText  = () => {
  return (status: string): string => {
    return `uploads.status.${status}`;
  };
};


export const isActiveStatus = (status: string): boolean => {
  const activeStatuses = [
    'PENDING', 'MERGING_STARTED', 'MERGING', 'VERIFYING_CHUNKS', 'PREPARING_MERGE',
    'MERGING_CHUNKS', 'VERIFYING_MERGE', 'UPDATING_DATABASE', 'QUEUING_TRANSCODING',
    'QUEUED_FOR_TRANSCODING', 'TRANSCODING_STARTED', 'ANALYZING_VIDEO',
    'COPYING_FILE', 'PREPARING_OUTPUT', 'TRANSCODING', 'PROCESSING',
    'UPLOADING_TO_S3', 'FINALIZING'
  ]
  return activeStatuses.includes(status)
}

export const getProgressPhase = (status: string): string => {
  if (['PENDING', 'MERGING_STARTED', 'MERGING', 'VERIFYING_CHUNKS', 'PREPARING_MERGE', 
       'MERGING_CHUNKS', 'VERIFYING_MERGE', 'UPDATING_DATABASE', 'MERGE_COMPLETED', 
       'MERGED', 'QUEUED_FOR_TRANSCODING', 'QUEUING_TRANSCODING'].includes(status)) {
    return 'Merging'
  }
  
  if (['TRANSCODING_STARTED', 'ANALYZING_VIDEO', 'COPYING_FILE', 'PREPARING_OUTPUT', 
       'TRANSCODING', 'PROCESSING'].includes(status)) {
    return 'Transcoding'
  }
  
  if (['UPLOADING_TO_S3'].includes(status)) {
    return 'Uploading'
  }
  
  if (['FINALIZING'].includes(status)) {
    return 'Finalizing'
  }
  
  if (['COMPLETED', 'TRANSCODED'].includes(status)) {
    return 'Completed'
  }
  
  if (['FAILED', 'MERGE_FAILED', 'TRANSCODE_FAILED'].includes(status)) {
    return 'Failed'
  }
  
  return 'Processing'
}

export const getEstimatedTimeRemaining = (status: string, progress: number): string | null => {
  if (progress >= 100 || !isActiveStatus(status)) return null
  
  const phase = getProgressPhase(status)
  
  switch (phase) {
    case 'Merging':
      return '1-2 minutes'
    case 'Transcoding':
      return '3-10 minutes'
    case 'Uploading':
      return '1-3 minutes'
    case 'Finalizing':
      return 'Less than 1 minute'
    default:
      return null
  }
}