drop table signup_meetings cascade constraints;
drop table signup_site_groups cascade constraints;
drop table signup_sites cascade constraints;
drop table signup_ts_attendees cascade constraints;
drop table signup_ts_waitinglist cascade constraints;
drop table signup_ts cascade constraints;
drop table signup_attachments cascade constraints;
drop sequence signup_meeting_ID_SEQ;
drop sequence signup_sites_ID_SEQ;
drop sequence signup_ts_ID_SEQ;

create table signup_meetings (
	id number(19,0) not null,
	version number(10,0) not null, 
	title varchar2(255 char) not null,
	description clob,
	location varchar2(255 char) not null,
	meeting_type varchar2(50 char) not null,
	creator_user_id varchar2(255 char) not null,
	start_time timestamp not null,
	end_time timestamp not null,
	signup_begins timestamp,
	signup_deadline timestamp,
	canceled number(1,0),
	locked number(1,0),
	receive_email_owner number(1,0),
	recurrence_id number(19,0),
	repeat_type varchar2(20 char) default NULL,
	allow_waitList  number(1,0)  default '1',
	allow_comment   number(1,0)  default '1',
	eid_input_mode  number(1,0)  default '0' NULL,
	auto_reminder   number(1,0)  default '0' NULL,
	allow_attendance   number(1,0)  default '0' NULL,	
	primary key (id));
	
create table signup_site_groups (
	signup_site_id number(19,0) not null,
	title varchar2(255 char),
	group_id varchar2(255 char) not null,
	calendar_event_id varchar2(2000 char),
	calendar_id varchar2(255 char),
	list_index number(10,0) not null,
	primary key (signup_site_id, list_index));
	
create table signup_sites (
	id number(19,0) not null,
	version number(10,0) not null,
	title varchar2(255 char),
	site_id varchar2(255 char) not null,
	calendar_event_id varchar2(2000 char),
	calendar_id varchar2(255 char),
	meeting_id number(19,0) not null,
	list_index number(10,0),
	primary key (id));
	
create table signup_ts_attendees (
	timeslot_id number(19,0) not null,
	attendee_user_id varchar2(255 char) not null,
	comments clob,
	signup_site_id varchar2(255 char) not null,
	calendar_event_id varchar2(255 char),
	calendar_id varchar2(255 char),
	list_index number(10,0) not null,
	attended  number(1,0)  default '0' NULL,
	primary key (timeslot_id, list_index));
	
create table signup_ts_waitinglist (
	timeslot_id number(19,0) not null, 
	attendee_user_id varchar2(255 char) not null,
	comments clob,
	signup_site_id varchar2(255 char) not null,
	calendar_event_id varchar2(255 char),
	calendar_id varchar2(255 char),
	list_index number(10,0) not null,
	attended  number(1,0)  default '0' NULL,
	primary key (timeslot_id, list_index));
	
create table signup_ts (
	id number(19,0) not null,
	version number(10,0) not null,
	start_time timestamp not null,
	end_time timestamp not null,
	max_no_of_attendees number(10,0),
	display_attendees number(1,0),
	canceled number(1,0),
	locked number(1,0),
	meeting_id number(19,0) not null,
	list_index number(10,0),
	primary key (id));

CREATE TABLE  signup_attachments (
   meeting_id 	number(19,0) NOT NULL,
   resource_Id 	varchar2(255 char) default NULL,
   file_name 	varchar2(255 char) default NULL,
   mime_type 	varchar2(80 char) default NULL,
   fileSize 	number(19,0) default NULL,
   location 	clob,
   isLink  		number(1,0),
   timeslot_id 	number(19,0) default NULL,
   view_by_all 	number(1,0)  default '1',
   created_by 	varchar2(255 char) NOT NULL,
   created_date 	timestamp NOT NULL,
   last_modified_by 	varchar2(255 char) NOT NULL,
   last_modified_date 	timestamp NOT NULL,
   list_index 	number(10,0) NOT NULL,
   PRIMARY KEY  (meeting_id,list_index));
	
alter table signup_site_groups add constraint FK_SIGNUP_SITE_GROUPS foreign key (signup_site_id) references signup_sites;
alter table signup_sites add constraint FK_SIGNUP_MEETING_SITES foreign key (meeting_id) references signup_meetings;
alter table signup_ts_attendees add constraint FK_SIGNUP_TIMESLOT_ATTENDEES foreign key (timeslot_id) references signup_ts;
alter table signup_ts_waitinglist add constraint FK_SIGNUP_TIMESLOT_WAITINGLIST foreign key (timeslot_id) references signup_ts;
alter table signup_ts add constraint FK_SIGNUP_MEETING_TIMESLOTS foreign key (meeting_id) references signup_meetings;
alter table signup_attachments add constraint FK_SIGNUP_MEETING_ATTACHMENT foreign key (meeting_id) references signup_meetings;

create sequence signup_meeting_ID_SEQ;
create sequence signup_sites_ID_SEQ;
create sequence signup_ts_ID_SEQ;
