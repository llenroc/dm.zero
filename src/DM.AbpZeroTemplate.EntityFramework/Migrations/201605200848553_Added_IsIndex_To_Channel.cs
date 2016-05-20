namespace DM.AbpZeroTemplate.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Added_IsIndex_To_Channel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.dm_Channels", "IsIndex", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.dm_Channels", "IsIndex");
        }
    }
}
