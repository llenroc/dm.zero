namespace DM.AbpZeroTemplate.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Change_Content_LastHitDate_Null : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.dm_Contents", "LastHitsDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.dm_Contents", "LastHitsDate", c => c.DateTime(nullable: false));
        }
    }
}
