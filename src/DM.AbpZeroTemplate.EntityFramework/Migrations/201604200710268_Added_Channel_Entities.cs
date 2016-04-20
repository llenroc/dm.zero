namespace DM.AbpZeroTemplate.Migrations
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;

    public partial class Added_Channel_Entities : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.dm_Channels",
                c => new
                {
                    Id = c.Long(nullable: false, identity: true),
                    AppId = c.Int(),
                    ParentId = c.Long(),
                    Code = c.String(nullable: false, maxLength: 128),
                    DisplayName = c.String(nullable: false, maxLength: 128),
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
                    { "DynamicFilter_Channel_MustHaveApp", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                    { "DynamicFilter_Channel_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.dm_Channels", t => t.ParentId)
                .Index(t => t.ParentId);
        }

        public override void Down()
        {
            DropForeignKey("dbo.dm_Channels", "ParentId", "dbo.dm_Channels");
            DropIndex("dbo.dm_Channels", new[] { "ParentId" });
            DropTable("dbo.dm_Channels",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_Channel_MustHaveApp", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                    { "DynamicFilter_Channel_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                });
        }
    }
}
