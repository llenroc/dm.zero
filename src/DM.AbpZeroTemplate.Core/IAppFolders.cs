namespace DM.AbpZeroTemplate
{
    public interface IAppFolders
    {
        string TempFileDownloadFolder { get; }

        string SampleProfileImagesFolder { get; }

        string WebLogsFolder { get; set; }

        string AppImageFolder { get; set; }
        string AppVideoFolder { get; set; }
        string AppFileFolder { get; set; }
    }
}