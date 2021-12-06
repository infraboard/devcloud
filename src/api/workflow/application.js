import request from "@/api/client";
import workflow from "./settings";

export function QUERY_APPLICATION(query) {
  return request({
    url: `${workflow.baseURL}/applications`,
    method: "get",
    params: query,
  });
}

export function QUERY_REPO_PROJECT(query) {
  return request({
    url: `${workflow.baseURL}/repo/projects`,
    method: "get",
    params: query,
  });
}

export function DESCRIBE_APPLICATION(id, query) {
  return request({
    url: `${workflow.baseURL}/applications/${id}`,
    method: "get",
    params: query,
  });
}

export function CREATE_APPLICATION(data) {
  return request({
    url: `${workflow.baseURL}/applications/`,
    method: "post",
    data,
  });
}

export function DELETE_APPLICATION(name, query) {
  return request({
    url: `${workflow.baseURL}/applications/${name}`,
    method: "delete",
    params: query,
  });
}

export function PATCH_APPLICATION_PIPELINE(id, data) {
  return request({
    url: `${workflow.baseURL}/applications/${id}`,
    method: "patch",
    data,
  });
}
