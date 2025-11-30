/* global user_pref */

// Adapted from https://github.com/pyllyukko/user.js/blob/master/user.js

// PREF: Disable Extension recommendations (Firefox >= 65)
// https://support.mozilla.org/en-US/kb/extension-recommendations
user_pref('browser.newtabpage.activity-stream.asrouter.userprefs.cfr', false);

// PREF: Disable Mozilla telemetry/experiments
// https://wiki.mozilla.org/Platform/Features/Telemetry
// https://wiki.mozilla.org/Privacy/Reviews/Telemetry
// https://wiki.mozilla.org/Telemetry
// https://www.mozilla.org/en-US/legal/privacy/firefox.html#telemetry
// https://support.mozilla.org/t5/Firefox-crashes/Mozilla-Crash-Reporter/ta-p/1715
// https://wiki.mozilla.org/Security/Reviews/Firefox6/ReviewNotes/telemetry
// https://gecko.readthedocs.io/en/latest/browser/experiments/experiments/manifest.html
// https://wiki.mozilla.org/Telemetry/Experiments
// https://support.mozilla.org/en-US/questions/1197144
// https://firefox-source-docs.mozilla.org/toolkit/components/telemetry/telemetry/internals/preferences.html#id1
user_pref('toolkit.telemetry.enabled', false);
user_pref('toolkit.telemetry.unified', false);
user_pref('toolkit.telemetry.archive.enabled', false);
user_pref('experiments.supported', false);
user_pref('experiments.enabled', false);
user_pref('experiments.manifest.uri', '');
user_pref('app.shield.optoutstudies.enabled', false);

// PREF: Disable sending reports of tab crashes to Mozilla (about:tabcrashed), don't nag user about unsent crash reports
// https://hg.mozilla.org/mozilla-central/file/tip/browser/app/profile/firefox.js
user_pref('browser.tabs.crashReporting.sendReport', false);
user_pref('browser.crashReports.unsubmittedCheck.enabled', false);
user_pref('browser.crashReports.unsubmittedCheck.autoSubmit2', false);

// PREF: Disable collection/sending of the health report (healthreport.sqlite*)
// https://support.mozilla.org/en-US/kb/firefox-health-report-understand-your-browser-perf
// https://gecko.readthedocs.org/en/latest/toolkit/components/telemetry/telemetry/preferences.html
user_pref('datareporting.healthreport.uploadEnabled', false);
user_pref('datareporting.usage.uploadEnabled', false);
user_pref('datareporting.healthreport.service.enabled', false);
user_pref('datareporting.policy.dataSubmissionEnabled', false);
// "Allow Firefox to make personalized extension recommendations"
user_pref('browser.discovery.enabled', false);

// PREF: Disable "Recommended by Pocket" in Firefox Quantum
user_pref('browser.newtabpage.activity-stream.feeds.section.topstories', false);

// Enable extension installation without user interaction
user_pref('xpinstall.signatures.required', false);
user_pref('extensions.autoDisableScopes', 10);
user_pref('extensions.enabledScopes', 15);

// Disable Sponsored Shortcuts in Home
user_pref('browser.newtabpage.activity-stream.showSponsoredTopSites', false);
user_pref('browser.newtabpage.activity-stream.showSponsoredCheckboxes', false);
