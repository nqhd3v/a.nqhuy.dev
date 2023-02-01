const activityTracking = {
  'activityTracking.desc': "This application allow user to track their activities.",
  'activityTracking.create.sub-tit': 'Create a new activity by its name',
  'activityTracking.actions.desc': 'Actions with your activity.',
  'activityTracking.join.sub-tit': 'Join activity by invite!',
  'activityTracking.join.desc': 'Join activity by invite!',
  'activityTracking.join.run': 'join now',
  'activityTracking.participants.count': '{count, plural, =0 {No participants} one {# participant} other {# participants}}',
  'activityTracking.info.no-time': 'no time',
  'activityTracking.list.my': 'All activities you have been joined',
  'activityTracking.checkIn.waiting': 'Waiting for someone checking-in...',
  'activityTracking.checkIn.count': '{count, plural, =0 {No one} one {1 person} other {# persons}} checked in',
  'activityTracking.checkIn.count-with-me': 'You {count, plural, =0 {} one {and another person} other {and # other persons}} checked in',
  'activityTracking.checkIn.run': 'check-in now',
  'activityTracking.checkIn.checked': 'checked-in',
  'activityTracking.checkIn.run.start': 'start check-in',
  'activityTracking.checkIn.run.starting': 'starting check-in',
  'activityTracking.checkIn.run.finish': 'finish check-in',
  'activityTracking.checkIn.run.finishing': 'finishing check-in',
  'activityTracking.checkIn.run.running': 'processing check-in',
  'activityTracking.checkIn.run.checking': 'checking-in for you',
  // ERROR =============================
  'error.activityTracking.html.no-view': 'Can not view this activity information because <b>it is not exist</b>!',
  'error.activityTracking.checkIn.activity-removed-while-checking-in': 'Someone removed this activity! Re-check and try again later!',
  'error.activityTracking.checkIn.turn-off-while-checking-in': 'Someone turned off Check In progress! Re-open to continue!',
  // EXCEPTION =========================
  'exception.activityTracking.form.time.require-or-empty-together': 'This both field have to emptied, or filled together!',
  'exception.activityTracking.invalid-input': 'Re-check your input data to continue!',
  'exception.activityTracking.create.unknown': 'Unknown error when creating a new activity!',
  'exception.activityTracking.get.unknown': 'Unknown error when getting all activities!',
  'exception.activityTracking.get-by-code.unknown': 'Unknown error when getting an activity by its code!',
  'exception.activityTracking.update.unknown': 'Unknown error when updating an activity!',
  'exception.activityTracking.join.unknown': 'Unknown error when joining an activity!',
  'exception.activityTracking.notfound': 'Activity not found!'
};

export default activityTracking;