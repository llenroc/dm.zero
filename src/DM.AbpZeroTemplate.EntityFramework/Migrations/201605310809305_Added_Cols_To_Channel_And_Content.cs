namespace DM.AbpZeroTemplate.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Added_Cols_To_Channel_And_Content : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.dm_Channels", "ModelType", c => c.String(maxLength: 50));
            AddColumn("dbo.dm_Channels", "ChannelGroupNameCollection", c => c.String(maxLength: 256));
            AddColumn("dbo.dm_Channels", "ImageUrl", c => c.String(maxLength: 256));
            AddColumn("dbo.dm_Channels", "FilePath", c => c.String(maxLength: 256));
            AddColumn("dbo.dm_Channels", "LinkUrl", c => c.String(maxLength: 256));
            AddColumn("dbo.dm_Channels", "LinkType", c => c.String(maxLength: 50));
            AddColumn("dbo.dm_Channels", "Content", c => c.String());
            AddColumn("dbo.dm_Channels", "Keywords", c => c.String(maxLength: 50));
            AddColumn("dbo.dm_Channels", "Description", c => c.String(maxLength: 50));
            AddColumn("dbo.dm_Channels", "ContentNum", c => c.Int(nullable: false));
            AddColumn("dbo.dm_Contents", "SubTitle", c => c.String(maxLength: 128));
            AddColumn("dbo.dm_Contents", "ImageUrl", c => c.String(maxLength: 50));
            AddColumn("dbo.dm_Contents", "VideoUrl", c => c.String(maxLength: 50));
            AddColumn("dbo.dm_Contents", "FileUrl", c => c.String(maxLength: 50));
            AddColumn("dbo.dm_Contents", "LinkUrl", c => c.String(maxLength: 256));
            AddColumn("dbo.dm_Contents", "Summary", c => c.String(maxLength: 256));
            AddColumn("dbo.dm_Contents", "Author", c => c.String(maxLength: 50));
            AddColumn("dbo.dm_Contents", "Source", c => c.String(maxLength: 50));
            AddColumn("dbo.dm_Contents", "IsTop", c => c.Boolean(nullable: false));
            AddColumn("dbo.dm_Contents", "IsRecommend", c => c.Boolean(nullable: false));
            AddColumn("dbo.dm_Contents", "IsHot", c => c.Boolean(nullable: false));
            AddColumn("dbo.dm_Contents", "IsColor", c => c.Boolean(nullable: false));
            AddColumn("dbo.dm_Contents", "ContentGroupNameCollection", c => c.String(maxLength: 256));
            AddColumn("dbo.dm_Contents", "Tags", c => c.String(maxLength: 50));
            AddColumn("dbo.dm_Contents", "IsChecked", c => c.Boolean(nullable: false));
            AddColumn("dbo.dm_Contents", "CheckedLevel", c => c.Int(nullable: false));
            AddColumn("dbo.dm_Contents", "Comments", c => c.Int(nullable: false));
            AddColumn("dbo.dm_Contents", "Hits", c => c.Int(nullable: false));
            AddColumn("dbo.dm_Contents", "HitsByDay", c => c.Int(nullable: false));
            AddColumn("dbo.dm_Contents", "HitsByWeek", c => c.Int(nullable: false));
            AddColumn("dbo.dm_Contents", "HitsByMonth", c => c.Int(nullable: false));
            AddColumn("dbo.dm_Contents", "LastHitsDate", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.dm_Contents", "LastHitsDate");
            DropColumn("dbo.dm_Contents", "HitsByMonth");
            DropColumn("dbo.dm_Contents", "HitsByWeek");
            DropColumn("dbo.dm_Contents", "HitsByDay");
            DropColumn("dbo.dm_Contents", "Hits");
            DropColumn("dbo.dm_Contents", "Comments");
            DropColumn("dbo.dm_Contents", "CheckedLevel");
            DropColumn("dbo.dm_Contents", "IsChecked");
            DropColumn("dbo.dm_Contents", "Tags");
            DropColumn("dbo.dm_Contents", "ContentGroupNameCollection");
            DropColumn("dbo.dm_Contents", "IsColor");
            DropColumn("dbo.dm_Contents", "IsHot");
            DropColumn("dbo.dm_Contents", "IsRecommend");
            DropColumn("dbo.dm_Contents", "IsTop");
            DropColumn("dbo.dm_Contents", "Source");
            DropColumn("dbo.dm_Contents", "Author");
            DropColumn("dbo.dm_Contents", "Summary");
            DropColumn("dbo.dm_Contents", "LinkUrl");
            DropColumn("dbo.dm_Contents", "FileUrl");
            DropColumn("dbo.dm_Contents", "VideoUrl");
            DropColumn("dbo.dm_Contents", "ImageUrl");
            DropColumn("dbo.dm_Contents", "SubTitle");
            DropColumn("dbo.dm_Channels", "ContentNum");
            DropColumn("dbo.dm_Channels", "Description");
            DropColumn("dbo.dm_Channels", "Keywords");
            DropColumn("dbo.dm_Channels", "Content");
            DropColumn("dbo.dm_Channels", "LinkType");
            DropColumn("dbo.dm_Channels", "LinkUrl");
            DropColumn("dbo.dm_Channels", "FilePath");
            DropColumn("dbo.dm_Channels", "ImageUrl");
            DropColumn("dbo.dm_Channels", "ChannelGroupNameCollection");
            DropColumn("dbo.dm_Channels", "ModelType");
        }
    }
}
