/**
 * Kenya INGO dashboard — email digest on change.
 *
 * Runs on a Google Apps Script time-driven trigger (free, no Blaze plan,
 * no card on file). Polls the shared Firestore document over its public
 * REST API, diffs it against the last-seen state (stored in Script
 * Properties), and emails a summary if anything changed.
 *
 * Setup: see ALERTS.md in the repo root.
 */

// ---- CONFIG ----
var PROJECT_ID = "nslf-ingo";
var API_KEY = "AIzaSyCUyOC8cqob7L2PtCnH-8Anu77cbRFZwu4"; // same public web key as index.html
var DOC_PATH = "boards/kenya-ingo";
var NOTIFY_EMAILS = ["charlesmuiruri13@gmail.com"]; // add more addresses here
var DASHBOARD_URL = "https://charlesmunga21.github.io/NSLF_KE/";

var ITEM_TITLES = {
  "1.1": "Notarized certificate of registration",
  "1.2": "Constitution / charter",
  "1.3": "Board resolution",
  "1.4": "Letter of authorisation",
  "2.1": "Form 2 — name search and reservation",
  "2.2": "Form 1 — application",
  "2.3": "Form 3 — officials' details",
  "2.4": "Addendum to Form 3",
  "2.5": "Cover letter",
  "2.6": "Proposed Kenya constitution",
  "3.1": "Kenyan officials: IDs and KRA PINs",
  "3.2": "Foreign officials: passports",
  "3.3": "DCI certificate of good conduct",
  "3.4": "Foreign police clearance",
  "3.5": "Passport photographs",
  "4.1": "Year one budget",
  "4.2": "Proof of funds",
  "4.3": "Physical office",
  "4.4": "Line ministry",
  "5.1": "Submit Form 2",
  "5.2": "Compile the dossier",
  "5.3": "File and pay",
  "5.4": "Security vetting",
  "5.5": "Sign Form 5C"
};

var STATUS_LABEL = { todo: "Not started", active: "In progress", filed: "Filed" };

// ---- Firestore REST value decoder ----
function decodeValue(v) {
  if (!v) return null;
  if (v.mapValue) {
    var out = {};
    var f = v.mapValue.fields || {};
    for (var k in f) out[k] = decodeValue(f[k]);
    return out;
  }
  if (v.arrayValue) {
    return (v.arrayValue.values || []).map(decodeValue);
  }
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return parseInt(v.integerValue, 10);
  if ("doubleValue" in v) return v.doubleValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("timestampValue" in v) return v.timestampValue;
  return null;
}

function checkForUpdates() {
  var url = "https://firestore.googleapis.com/v1/projects/" + PROJECT_ID +
    "/databases/(default)/documents/" + DOC_PATH + "?key=" + API_KEY;
  var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) {
    Logger.log("Fetch failed: " + res.getResponseCode() + " " + res.getContentText());
    return;
  }

  var data = JSON.parse(res.getContentText());
  var items = (data.fields && data.fields.items) ? decodeValue(data.fields.items) : {};

  var props = PropertiesService.getScriptProperties();
  var prevRaw = props.getProperty("lastState");
  var prev = prevRaw ? JSON.parse(prevRaw) : {};

  var changes = [];
  Object.keys(items).forEach(function (id) {
    var cur = items[id] || {};
    var old = prev[id] || {};
    if (cur.status !== old.status) {
      var title = ITEM_TITLES[id] || id;
      var line = id + " " + title + " → " + (STATUS_LABEL[cur.status] || cur.status);
      if (cur.owner) line += " (" + cur.owner + ")";
      changes.push(line);
    }
  });

  // Save current state for next run's comparison, regardless of whether we email.
  props.setProperty("lastState", JSON.stringify(items));

  if (changes.length === 0) return;

  var filed = Object.keys(items).filter(function (id) { return items[id].status === "filed"; }).length;
  var total = Object.keys(items).length;

  var subject = "NSLF Kenya INGO — " + changes.length + " update" + (changes.length > 1 ? "s" : "");
  var body = changes.join("\n") + "\n\nBoard is now " + filed + "/" + total + " filed.\n\n" + DASHBOARD_URL;

  MailApp.sendEmail(NOTIFY_EMAILS.join(","), subject, body);
}

/**
 * Run once manually from the Apps Script editor to set up the recurring
 * check. Safe to re-run — it clears any existing trigger for this
 * function first so you don't end up with duplicates.
 */
function createTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "checkForUpdates") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("checkForUpdates").timeBased().everyMinutes(15).create();
}
