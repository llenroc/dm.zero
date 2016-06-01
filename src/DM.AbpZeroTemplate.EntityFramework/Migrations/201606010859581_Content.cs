namespace DM.AbpZeroTemplate.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Content : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.dm_Contents", "ImageUrl", c => c.String(maxLength: 256));
            AlterColumn("dbo.dm_Contents", "VideoUrl", c => c.String(maxLength: 256));
            AlterColumn("dbo.dm_Contents", "FileUrl", c => c.String(maxLength: 256));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.dm_Contents", "FileUrl", c => c.String(maxLength: 50));
            AlterColumn("dbo.dm_Contents", "VideoUrl", c => c.String(maxLength: 50));
            AlterColumn("dbo.dm_Contents", "ImageUrl", c => c.String(maxLength: 50));
        }
    }
}
