import { supabase } from '../lib/supabase';

interface UploadPhotoOptions {
  file: File;
  uploader: string;
  title: string;
  tags: string;
  description: string;
}

export async function uploadPhotoWithMetadata({
  file,
  uploader,
  title,
  tags,
  description,
}: UploadPhotoOptions): Promise<boolean> {
  try {
    // Step 1: 파일명을 고유하게 생성
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${uploader}/${fileName}`;

    // Step 2: Supabase Storage에 업로드
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Storage upload error:', uploadError.message);
      return false;
    }

    // Step 3: Public URL 가져오기
    const {
      data: { publicUrl },
    } = supabase.storage.from('photos').getPublicUrl(filePath);

    // Step 4: 메타데이터 DB 저장
    const { error: insertError } = await supabase.from('photos').insert([
      {
        uploader,
        url: publicUrl,
        title,
        tags,
        description,
      },
    ]);

    if (insertError) {
      console.error('DB insert error:', insertError.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Upload error:', err);
    return false;
  }
}
