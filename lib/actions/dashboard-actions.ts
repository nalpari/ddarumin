'use server'

import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/supabase/admin'

export async function getDashboardStats() {
  await requireAdminAuth()
  
  const [
    totalMenus,
    activeMenus,
    totalStores,
    operatingStores,
    totalEvents,
    activeEvents,
    pendingInquiries,
    totalInquiries,
    totalFAQs,
    activeFAQs,
    upcomingSessions,
    totalSessions,
  ] = await Promise.all([
    prisma.menu.count(),
    prisma.menu.count({ where: { status: 'ACTIVE' } }),
    prisma.store.count(),
    prisma.store.count({ where: { operatingStatus: 'OPERATING' } }),
    prisma.event.count(),
    prisma.event.count({ where: { status: 'ACTIVE' } }),
    prisma.franchiseInquiry.count({ where: { status: 'PENDING' } }),
    prisma.franchiseInquiry.count(),
    prisma.fAQ.count(),
    prisma.fAQ.count({ where: { status: 'ACTIVE' } }),
    prisma.startupSession.count({ where: { status: 'ACCEPTING' } }),
    prisma.startupSession.count(),
  ])
  
  return {
    menus: {
      total: totalMenus,
      active: activeMenus,
    },
    stores: {
      total: totalStores,
      operating: operatingStores,
    },
    events: {
      total: totalEvents,
      active: activeEvents,
    },
    inquiries: {
      total: totalInquiries,
      pending: pendingInquiries,
    },
    faqs: {
      total: totalFAQs,
      active: activeFAQs,
    },
    sessions: {
      total: totalSessions,
      upcoming: upcomingSessions,
    },
  }
}

export async function getRecentActivities() {
  await requireAdminAuth()
  
  const [
    recentInquiries,
    recentApplications,
    recentMenus,
    recentEvents,
  ] = await Promise.all([
    prisma.franchiseInquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        status: true,
      },
    }),
    prisma.sessionApplicant.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        session: {
          select: {
            round: true,
          },
        },
      },
    }),
    prisma.menu.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        status: true,
      },
    }),
    prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        status: true,
      },
    }),
  ])
  
  const activities = [
    ...recentInquiries.map(inquiry => ({
      id: inquiry.id,
      type: 'inquiry' as const,
      title: `새 가맹문의: ${inquiry.name}`,
      time: inquiry.createdAt,
      status: inquiry.status,
    })),
    ...recentApplications.map(app => ({
      id: app.id,
      type: 'application' as const,
      title: `${app.session.round}회 창업설명회 신청: ${app.name}`,
      time: app.createdAt,
      status: 'NEW',
    })),
    ...recentMenus.map(menu => ({
      id: menu.id,
      type: 'menu' as const,
      title: `메뉴 등록: ${menu.name}`,
      time: menu.createdAt,
      status: menu.status,
    })),
    ...recentEvents.map(event => ({
      id: event.id,
      type: 'event' as const,
      title: `이벤트 등록: ${event.title}`,
      time: event.createdAt,
      status: event.status,
    })),
  ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 10)
  
  return activities
}