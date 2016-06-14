namespace DM.AbpZeroTemplate.Migrations
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Infrastructure.Annotations;
    using System.Data.Entity.Migrations;
    
    public partial class Added_Good : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.dm_Goods",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        SubTitle = c.String(maxLength: 128),
                        ImageUrl = c.String(maxLength: 256),
                        VideoUrl = c.String(maxLength: 256),
                        FileUrl = c.String(maxLength: 256),
                        LinkUrl = c.String(maxLength: 256),
                        Summary = c.String(maxLength: 256),
                        IsTop = c.Boolean(nullable: false),
                        IsRecommend = c.Boolean(nullable: false),
                        IsHot = c.Boolean(nullable: false),
                        IsColor = c.Boolean(nullable: false),
                        AppId = c.Long(nullable: false),
                        ChannelId = c.Long(nullable: false),
                        Title = c.String(nullable: false, maxLength: 128),
                        ContentText = c.String(),
                        ContentGroupNameCollection = c.String(maxLength: 256),
                        Tags = c.String(maxLength: 50),
                        IsChecked = c.Boolean(nullable: false),
                        CheckedLevel = c.Int(nullable: false),
                        Comments = c.Int(nullable: false),
                        Hits = c.Int(nullable: false),
                        HitsByDay = c.Int(nullable: false),
                        HitsByWeek = c.Int(nullable: false),
                        HitsByMonth = c.Int(nullable: false),
                        LastHitsDate = c.DateTime(),
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
                    { "DynamicFilter_Good_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.dm_Apps", t => t.AppId, cascadeDelete: true)
                .ForeignKey("dbo.dm_Channels", t => t.ChannelId, cascadeDelete: true)
                .Index(t => t.AppId)
                .Index(t => t.ChannelId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.dm_Goods", "ChannelId", "dbo.dm_Channels");
            DropForeignKey("dbo.dm_Goods", "AppId", "dbo.dm_Apps");
            DropIndex("dbo.dm_Goods", new[] { "ChannelId" });
            DropIndex("dbo.dm_Goods", new[] { "AppId" });
            DropTable("dbo.dm_Goods",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_Good_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                });
        }
    }
}
