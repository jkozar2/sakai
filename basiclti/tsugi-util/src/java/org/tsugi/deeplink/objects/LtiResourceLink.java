
package org.tsugi.deeplink.objects;

public class LtiResourceLink extends ContentItem {

	public LtiResourceLink() {
		this.type = TYPE_LTIRESOURCELINK;
	}

}

/*
 
{
"type": "ltiResourceLink",
"title": "A title",
"text": "This is a link to an activity that will be graded",
"url": "https://lti.example.com/launchMe",
"icon": {
  "url": "https://lti.example.com/image.jpg",
  "width": 100,
  "height": 100
},
"thumbnail": {
  "url": "https://lti.example.com/thumb.jpg",
  "width": 90,
  "height": 90
},
"lineItem": {
  "scoreMaximum": 87,
  "label": "Chapter 12 quiz",
  "resourceId": "xyzpdq1234",
  "tag": "originality"
},
"available": {
  "startDateTime": "2018-02-06T20:05:02Z",
  "endDateTime": "2018-03-07T20:05:02Z"
},
"submission": {
  "endDateTime": "2018-03-06T20:05:02Z"
},
"custom": {
  "quiz_id": "az-123",
  "duedate": "$Resource.submission.endDateTime"
},
"window": {
  "targetName": "examplePublisherContent"
},
"iframe": {
  "height": 890
}
},

 */

