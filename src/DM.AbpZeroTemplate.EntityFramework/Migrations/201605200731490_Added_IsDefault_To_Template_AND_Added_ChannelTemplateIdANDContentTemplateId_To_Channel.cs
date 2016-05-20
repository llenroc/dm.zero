namespace DM.AbpZeroTemplate.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Added_IsDefault_To_Template_AND_Added_ChannelTemplateIdANDContentTemplateId_To_Channel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.dm_Channels", "ChannelTemplateId", c => c.Long(nullable: false));
            AddColumn("dbo.dm_Channels", "ContentTemplateId", c => c.Long(nullable: false));
            AddColumn("dbo.dm_Templates", "IsDefault", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.dm_Templates", "IsDefault");
            DropColumn("dbo.dm_Channels", "ContentTemplateId");
            DropColumn("dbo.dm_Channels", "ChannelTemplateId");
        }
    }
}
