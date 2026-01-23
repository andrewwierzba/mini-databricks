SELECT * FROM system.lakeflow.job_run_timeline
WHERE workspace_id="4558934886764708" --workspaceId/orgId
AND job_id="247438488469935"
AND termination_code IS NOT NULL -- tells the job has terminated
AND period_end_time > current_timestamp - INTERVAL 10 MINUTES; -- terminated within 10 minutes