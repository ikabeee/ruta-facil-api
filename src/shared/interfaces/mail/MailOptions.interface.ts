export interface MailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    from?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: MailAttachment[];
}

export interface MailAttachment {
    filename: string;
    path?: string;
    content?: string | Buffer;
    contentType?: string;
}

export interface MailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}
