import { Request, Response } from 'express';
import { InvalidBio, InvalidIPreference, InvalidInterest } from '../../../shared/errors';
import { AvailableTags } from '../../../data/data-tags';

export function validateSettings(req: Request, res: Response, next: any) {
    const { preference, biography, tags } = req.body;

    if (!(preference === 'male' || preference === 'female' || preference === 'bisexual')) {
        return res
            .status(200)
            .json({ message: 'error', error: InvalidIPreference });
    }

	if (!validateTags(tags)) {
        return res
            .status(200)
            .json({ message: 'error', error: InvalidInterest });
    }

	if (!validateBio(biography)) {
        return res
            .status(200)
            .json({ message: 'error', error: InvalidBio });
    }

    next();
}

function validateTags(tagsUser: string[]): boolean {
	const allTags: string[] = AvailableTags;
	if (tagsUser.length === 0) return true;
	tagsUser.forEach((e) => {
		if (!allTags.includes(e))
			return false;
	});
	return true;
}

function validateBio(bio: string): boolean {
	
	return true;
}