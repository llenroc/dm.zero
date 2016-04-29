namespace DM.AbpZeroTemplate.Migrations
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Infrastructure.Annotations;
    using System.Data.Entity.Migrations;
    
    public partial class Added_Template_Entities : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.dm_Templates",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        AppId = c.Long(nullable: false),
                        Title = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 128),
                        Type = c.String(nullable: false, maxLength: 64),
                        Extension = c.String(nullable: false, maxLength: 64),
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
                    { "DynamicFilter_Template_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.dm_Apps", t => t.AppId, cascadeDelete: true)
                .Index(t => t.AppId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.dm_Templates", "AppId", "dbo.dm_Apps");
            DropIndex("dbo.dm_Templates", new[] { "AppId" });
            DropTable("dbo.dm_Templates",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_Template_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                });
        }
    }
}
