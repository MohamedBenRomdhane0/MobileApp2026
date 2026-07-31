export const uploads = {
  processing_one: 'Processing {{count}} video',
  processing_other: 'Processing {{count}} videos',
  uploads_one: '{{count}} upload',
  uploads_other: '{{count}} uploads',

  restored: 'Restored {{count}} upload from previous session',
  restored_title: 'Restored',
  this_may_take_several_minutes: 'This may take several minutes', 
  welcome_back: 'Welcome back',

  status: {
    PENDING: 'Waiting in queue...',
    MERGING_STARTED: 'Starting merge process...',
    MERGING: 'Merging video chunks...',
    VERIFYING_CHUNKS: 'Verifying uploaded chunks...',
    PREPARING_MERGE: 'Preparing to merge...',
    MERGING_CHUNKS: 'Combining video parts...',
    VERIFYING_MERGE: 'Verifying merged file...',
    UPDATING_DATABASE: 'Updating records...',
    DATABASE_UPDATED: 'Records updated successfully',
    MERGE_COMPLETED: 'Merge completed successfully',
    MERGED: 'Video chunks merged successfully',
    QUEUED_FOR_TRANSCODING: 'Queued for processing...',
    QUEUING_TRANSCODING: 'Preparing for transcoding...',

    TRANSCODING_STARTED: 'Starting video processing...',
    ANALYZING_VIDEO: 'Analyzing video properties...',
    COPYING_FILE: 'Preparing video for processing...',
    PREPARING_OUTPUT: 'Setting up output formats...',
    TRANSCODING: 'Converting to multiple qualities...',
    PROCESSING: 'Processing video streams...',
    UPLOADING_TO_S3: 'Uploading to cloud storage...',
    FINALIZING: 'Finalizing video processing...',

    COMPLETED: 'Video is ready to play!',
    TRANSCODED: 'Video processing completed!',

    FAILED: 'Processing failed',
    MERGE_FAILED: 'Failed to merge video chunks',
    TRANSCODE_FAILED: 'Failed to process video',

    CANCELLED: 'Processing was cancelled',
  },

};
