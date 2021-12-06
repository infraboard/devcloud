import request from "@/api/client";
import workflow from "./settings";

export function QUERY_DEPLOY(query) {
  return request({
    url: `${workflow.baseURL}/deploys`,
    method: "get",
    params: query,
  });
}
