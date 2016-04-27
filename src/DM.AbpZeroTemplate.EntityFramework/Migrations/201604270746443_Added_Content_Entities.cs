namespace DM.AbpZeroTemplate.Migrations
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Infrastructure.Annotations;
    using System.Data.Entity.Migrations;
    
    public partial class Added_Content_Entities : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.dm_Contents",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        AppId = c.Long(nullable: false),
                        ChannelId = c.Long(nullable: false),
                        Title = c.String(nullable: false, maxLength: 128),
                        ContentText = c.String(),
                        IsDeleted = c.Boolean(nullable: false),
                        DeleterUserId = c.Long(),
                        DeletionTime = c.DateTime(),
                        LastModificationTime = c.DateTime(),
                        LastModifierUserId = c.Long(),
                        CreationTime = c.DateTime(nullable: false),
                        CreatorUserId = c.Long(),
                    },
                annotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_Content_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.dm_Apps", t => t.AppId, cascadeDelete: true)
                .ForeignKey("dbo.dm_Channels", t => t.ChannelId, cascadeDelete: true)
                .Index(t => t.AppId)
                .Index(t => t.ChannelId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.dm_Contents", "ChannelId", "dbo.dm_Channels");
            DropForeignKey("dbo.dm_Contents", "AppId", "dbo.dm_Apps");
            DropIndex("dbo.dm_Contents", new[] { "ChannelId" });
            DropIndex("dbo.dm_Contents", new[] { "AppId" });
            DropTable("dbo.dm_Contents",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_Content_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                });
        }
    }
}
