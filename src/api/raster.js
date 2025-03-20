import request from '@/utils/request'

export const rsGetRawList = () => request.get("/raster/raw-raster")
export const getSearchResult = (q) => request.post("/search", { q:q})