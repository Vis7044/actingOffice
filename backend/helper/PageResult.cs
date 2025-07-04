namespace backend.helper
{
    public class PageResult<T>
    {
        public long TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public List<T> Data { get; set; }
    }
}
