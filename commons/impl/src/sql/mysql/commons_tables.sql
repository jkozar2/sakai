CREATE TABLE COMMONS_COMMONS
(
    ID char(36) NOT NULL,
    SITE_ID varchar(99) NOT NULL,
    EMBEDDER varchar(24) NOT NULL,
    PRIMARY KEY(ID)
);

CREATE TABLE COMMONS_COMMONS_POST
(
    COMMONS_ID char(36),
    POST_ID char(36),
    UNIQUE INDEX commons_id_post_id (COMMONS_ID,POST_ID)
);

CREATE TABLE COMMONS_POST
(
    ID char(36) NOT NULL,
    CONTENT MEDIUMTEXT NOT NULL,
    CREATOR_ID varchar(99) NOT NULL,
    CREATED_DATE datetime NOT NULL,
    MODIFIED_DATE datetime NOT NULL,
    RELEASE_DATE datetime NOT NULL,
    PRIORITY bit(1) DEFAULT FALSE NOT NULL;
    INDEX creator_id (CREATOR_ID),
    PRIMARY KEY(ID)
);

CREATE TABLE COMMONS_COMMENT
(
    ID char(36) NOT NULL,
    POST_ID char(36) references COMMONS_POST(ID),
    CONTENT MEDIUMTEXT NOT NULL,
    CREATOR_ID varchar(99) NOT NULL,
    CREATED_DATE datetime NOT NULL,
    MODIFIED_DATE datetime NOT NULL,
    INDEX creator_id (CREATOR_ID),
    INDEX post_id (POST_ID),
    PRIMARY KEY(ID)
);

CREATE TABLE COMMONS_LIKE
(
    USER_ID char(99) NOT NULL,
    POST_ID char(36) NOT NULL,
    VOTE bit(1) DEFAULT FALSE NOT NULL,
    MODIFIED_DATE datetime,
    PRIMARY KEY (USER_ID, POST_ID)
);
