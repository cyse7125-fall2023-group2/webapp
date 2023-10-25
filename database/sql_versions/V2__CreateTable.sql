CREATE TABLE IF NOT EXISTS app."http-checks"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default",
    uri character varying(255) COLLATE pg_catalog."default",
    is_paused boolean,
    num_retries integer,
    uptime_sla integer,
    response_time_sla integer,
    use_ssl boolean,
    response_status_code integer,
    check_interval_in_seconds integer,
    check_created timestamp with time zone,
    check_updated timestamp with time zone,
    CONSTRAINT "http-checks_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS app."http-checks"
    OWNER to postgres;