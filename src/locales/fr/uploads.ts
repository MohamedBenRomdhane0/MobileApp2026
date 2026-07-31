export const uploads = {
  processing_one: 'Traitement de {{count}} vidéo',
  processing_other: 'Traitement de {{count}} vidéos',
  uploads_one: '{{count}} téléchargement',
  uploads_other: '{{count}} téléchargements',

  restored: 'Restauration de {{count}} téléchargement depuis la session précédente',
  restored_title: 'Restauré',
  this_may_take_several_minutes: 'Cela peut prendre plusieurs minutes',
  welcome_back: 'Bon retour parmi nous',


  status: {
    PENDING: 'En attente dans la file...',
    MERGING_STARTED: 'Démarrage du processus de fusion...',
    MERGING: 'Fusion des segments vidéo...',
    VERIFYING_CHUNKS: 'Vérification des segments téléchargés...',
    PREPARING_MERGE: 'Préparation à la fusion...',
    MERGING_CHUNKS: 'Combinaison des parties vidéo...',
    VERIFYING_MERGE: 'Vérification du fichier fusionné...',
    UPDATING_DATABASE: 'Mise à jour des enregistrements...',
    DATABASE_UPDATED: 'Enregistrements mis à jour avec succès',
    MERGE_COMPLETED: 'Fusion terminée avec succès',
    MERGED: 'Segments vidéo fusionnés avec succès',
    QUEUED_FOR_TRANSCODING: 'En attente de traitement...',
    QUEUING_TRANSCODING: 'Préparation au transcodage...',

    TRANSCODING_STARTED: 'Démarrage du traitement vidéo...',
    ANALYZING_VIDEO: 'Analyse des propriétés de la vidéo...',
    COPYING_FILE: 'Préparation de la vidéo pour le traitement...',
    PREPARING_OUTPUT: 'Configuration des formats de sortie...',
    TRANSCODING: 'Conversion en plusieurs qualités...',
    PROCESSING: 'Traitement des flux vidéo...',
    UPLOADING_TO_S3: 'Téléversement vers le cloud...',
    FINALIZING: 'Finalisation du traitement vidéo...',

    COMPLETED: 'Vidéo prête à être lue !',
    TRANSCODED: 'Traitement vidéo terminé !',

    FAILED: 'Échec du traitement',
    MERGE_FAILED: 'Échec de la fusion des segments vidéo',
    TRANSCODE_FAILED: 'Échec du traitement de la vidéo',

    CANCELLED: 'Le traitement a été annulé',
  },
};
