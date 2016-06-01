using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Contents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DM.AbpZeroTemplate.CMS.Contents.Dto
{
    /// <summary>
    /// 内容传输对象
    /// </summary>
    [AutoMapFrom(typeof(Content))]
    public class ContentDto : AuditedEntityDto<long>
    {
        /// <summary>
        /// 应用ID
        /// </summary>
        public long AppId { get; set; }

        /// <summary>
        /// 栏目ID
        /// </summary>
        public long ChannelId { get; set; }

        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        public string ContentText { get; set; }

        /// <summary>
        /// 内容组
        /// </summary>
        public string ContentGroupNameCollection { get; set; }

        /// <summary>
        /// 内容标签
        /// </summary>
        public string Tags { get; set; }

        /// <summary>
        /// 是否审核
        /// </summary>
        public bool IsChecked { get; set; }

        /// <summary>
        /// 审核等级
        /// </summary>
        public int CheckedLevel { get; set; }

        /// <summary>
        /// 评论数量
        /// </summary>
        public int Comments { get; set; }

        /// <summary>
        /// 点击数
        /// </summary>
        public int Hits { get; set; }

        /// <summary>
        /// 日点击
        /// </summary>
        public int HitsByDay { get; set; }

        /// <summary>
        /// 周点击
        /// </summary>
        public int HitsByWeek { get; set; }

        /// <summary>
        /// 月点击
        /// </summary>
        public int HitsByMonth { get; set; }

        /// <summary>
        /// 最后点击时间
        /// </summary>
        public DateTime LastHitsDate { get; set; }

        /// <summary>
        /// 子标题
        /// </summary>
        public string SubTitle { get; set; }

        /// <summary>
        /// 图片
        /// </summary>
        public string ImageUrl { get; set; }

        /// <summary>
        /// 附件
        /// </summary>
        public string FileUrl { get; set; }

        /// <summary>
        /// 视频
        /// </summary>
        public string VideoUrl { get; set; }

        /// <summary>
        /// 外链
        /// </summary>
        public string LinkUrl { get; set; }

        /// <summary>
        /// 简介
        /// </summary>
        public string Summary { get; set; }

        /// <summary>
        /// 作者
        /// </summary>
        public string Author { get; set; }


        /// <summary>
        /// 来源
        /// </summary>
        public string Source { get; set; }

        /// <summary>
        /// 置顶
        /// </summary>
        public bool IsTop { get; set; }

        /// <summary>
        /// 推荐
        /// </summary>
        public bool IsRecommend { get; set; }

        /// <summary>
        /// 热点
        /// </summary>
        public bool IsHot { get; set; }

        /// <summary>
        /// 高亮
        /// </summary>
        public bool IsColor { get; set; }
    }
}
