using Abp.Dependency;

namespace DM.AbpZeroTemplate
{
    public class AppFolders : IAppFolders, ISingletonDependency
    {
        public string TempFileDownloadFolder { get; set; }

        public string SampleProfileImagesFolder { get; set; }

        public string WebLogsFolder { get; set; }

        public string AppImageFolder { get; set; }
        public string AppVideoFolder { get; set; }
        public string AppFileFolder { get; set; }
    }
}