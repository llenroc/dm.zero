namespace DM.AbpZeroTemplate.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Added_AppId_To_User : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AbpUsers", "AppId", c => c.Long(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AbpUsers", "AppId");
        }
    }
}
