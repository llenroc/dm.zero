﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Channels;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace DM.AbpZeroTemplate.CMS.Channels.Dto
{
    /// <summary>
    ///  栏目数据传输对象<see cref="Channel"/>
    /// </summary>
    [AutoMapFrom(typeof(Channel))]
    public class ChannelDto : AuditedEntityDto<long>
    {
        /// <summary>
        /// appID
        /// </summary>
        public long AppId { get; set; }

        /// <summary>
        ///  父级ID，可以null
        /// </summary>
        public long? ParentId { get; set; }

        /// <summary>
        ///  栏目编码
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        ///  展示名称
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// 内容数量
        /// </summary>
        public int ContentCount { get; set; }
    }
}
