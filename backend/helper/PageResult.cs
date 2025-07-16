namespace backend.helper
{
    /// <summary>
    /// used to return paginated results from the database,
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class PageResult<T>
    {
        /// <summary>
        /// total number of items in the collection,
        /// </summary>
        public long TotalCount { get; set; }
        /// <summary>
        /// number of pages in the collection,
        /// </summary>
        public int Page { get; set; }
        /// <summary>
        /// each page contains a fixed number of items,
        /// </summary>
        public int PageSize { get; set; }
        /// <summary>
        /// generic list of items in the collection,
        /// </summary>
        public List<T> Data { get; set; }
    }
}
